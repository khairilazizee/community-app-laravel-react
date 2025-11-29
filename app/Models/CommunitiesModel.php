<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunitiesModel extends Model
{
    protected $table = 'communities';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_private',
        'created_by',
        'updated_by',
    ];

    public function members()
    {
        return $this->hasMany(CommunityMembersModel::class);
    }
}
