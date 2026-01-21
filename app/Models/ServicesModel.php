<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicesModel extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'community_id',
        'owner_id',
        'name',
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

    protected $casts = [
        'is_private' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function comments()
    {
        return $this->morphMany(CommentsModel::class, 'commentable');
    }

    public function offerings()
    {
        return $this->hasMany(ServiceOffering::class, 'service_id');
    }
}
