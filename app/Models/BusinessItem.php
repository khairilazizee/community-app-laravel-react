<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessItem extends Model
{
    protected $table = 'business_items';

    protected $fillable = [
        'business_id',
        'category_id',
        'name',
        'price',
        'description',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function business()
    {
        return $this->belongsTo(BusinessesModel::class, 'business_id');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }
}
