<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostsModel extends Model
{
    protected $table = 'posts';

    protected $fillable = [
        'community_id',
        'user_id',
        'business_id',
        'title',
        'content',
        'type',
        'published_at',
        'is_active',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function business()
    {
        return $this->belongsTo(BusinessesModel::class);
    }
}
