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

    public function comments()
    {
        return $this->morphMany(CommentsModel::class, 'commentable');
    }

    public function items()
    {
        return $this->hasMany(BusinessItem::class, 'business_id');
    }

    public function hours()
    {
        return $this->hasMany(BusinessHour::class, 'business_id');
    }
}
