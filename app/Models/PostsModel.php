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
        'slug',
        'content',
        'type',
        'published_at',
        'is_active',
        'approval_status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_active' => 'boolean',
        'approved_at' => 'datetime',
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

    public function comments()
    {
        return $this->morphMany(CommentsModel::class, 'commentable');
    }

    public function tags()
    {
        return $this->belongsToMany(PostTag::class, 'post_tag', 'post_id', 'tag_id');
    }
}
