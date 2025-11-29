<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommunitiesModel extends Model
{
    use SoftDeletes;

    protected $table = 'communities';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_private',
        'banner_image',
        'logo_image',
        'website',
        'deleted_at'
    ];

    protected $casts = [
        'is_private' => 'boolean',
    ];

    public function members()
    {
        return $this->hasMany(CommunityMembersModel::class, 'community_id', 'id');
    }
}
