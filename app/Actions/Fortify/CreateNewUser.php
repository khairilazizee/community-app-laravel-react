<?php

namespace App\Actions\Fortify;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\User;
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
        Validator::make($input, [
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
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        if (!empty($input['community'])) {
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
        }

        return $user;
    }
}
