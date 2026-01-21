<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{
    protected $table = 'item_categories';

    protected $fillable = [
        'community_id',
        'name',
        'type',
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class, 'community_id');
    }
}
