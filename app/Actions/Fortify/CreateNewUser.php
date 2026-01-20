<?php

namespace App\Actions\Fortify;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $hasJoinRequest = !empty($input['community']);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'community' => ['nullable', 'string', 'max:255'],
            'community_name' => [$hasJoinRequest ? 'nullable' : 'required', 'string', 'max:255'],
        ];

        Validator::make($input, $rules)->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        if ($hasJoinRequest) {
            $community = CommunitiesModel::where('slug', $input['community'])
                ->orWhere('id', $input['community'])
                ->first();

            if ($community) {
                CommunityMembersModel::updateOrCreate(
                    [
                        'community_id' => $community->id,
                        'user_id' => $user->id,
                    ],
                    [
                        'role' => CommunityMemberRole::Member,
                        'status' => CommunityMemberStatus::Pending,
                    ]
                );
            }
        } else {
            $community = CommunitiesModel::create([
                'name' => $input['community_name'],
                'slug' => $this->generateSlug($input['community_name']),
                'description' => null,
                'is_private' => true,
            ]);

            CommunityMembersModel::create([
                'community_id' => $community->id,
                'user_id' => $user->id,
                'role' => CommunityMemberRole::Admin,
                'status' => CommunityMemberStatus::Active,
            ]);
        }

        return $user;
    }

    private function generateSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base !== '' ? $base : Str::random(8);
        $counter = 1;

        while ($this->slugExists($slug)) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function slugExists(string $slug): bool
    {
        return CommunitiesModel::where('slug', $slug)->exists();
    }
}
