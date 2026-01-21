<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostTag extends Model
{
    protected $table = 'post_tags';

    protected $fillable = [
        'community_id',
        'name',
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class, 'community_id');
    }
}
