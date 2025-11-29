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
        'banner_image',
        'logo_image',
    ];

    public function members()
    {
        return $this->hasMany(CommunityMembersModel::class);
    }
}
