<?php

namespace App\Models;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use Illuminate\Database\Eloquent\Model;

class CommunityMembersModel extends Model
{
    protected $table = 'community_members';

    protected $fillable = [
        'community_id',
        'user_id',
        'role',
        'status',
        'created_at',
    ];

    protected $casts = [
        'role' => CommunityMemberRole::class,
        'status' => CommunityMemberStatus::class
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
