<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsModel extends Model
{
    protected $table = 'news';

    protected $fillable = [
        'community_id',
        'user_id',
        'title',
        'slug',
        'content',
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

    public function comments()
    {
        return $this->morphMany(CommentsModel::class, 'commentable');
    }

    public function tags()
    {
        return $this->belongsToMany(NewsTag::class, 'news_tag', 'news_id', 'tag_id');
    }
}
