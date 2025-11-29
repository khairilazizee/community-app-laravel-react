<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessesModel extends Model
{
    protected $table = 'businesses';

    protected $fillable = [
        'community_id',
        'owner_id',
        'name',
        'type',
        'description',
        'address',
        'city',
        'state',
        'zip',
        'country',
        'phone',
        'website',
        'email',
        'is_private',
        'is_active',
        'created_by',
        'updated_by',
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->hasMany(PostsModel::class);
    }
}
