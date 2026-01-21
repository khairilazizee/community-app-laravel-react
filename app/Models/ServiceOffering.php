<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceOffering extends Model
{
    protected $table = 'service_offerings';

    protected $fillable = [
        'service_id',
        'category_id',
        'name',
        'price',
        'duration_minutes',
        'description',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration_minutes' => 'integer',
        'sort_order' => 'integer',
    ];

    public function service()
    {
        return $this->belongsTo(ServicesModel::class, 'service_id');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }
}
