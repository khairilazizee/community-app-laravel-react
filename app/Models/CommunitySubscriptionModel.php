<?php

namespace App\Models;

use App\SubscriptionStatus;
use Illuminate\Database\Eloquent\Model;

class CommunitySubscriptionModel extends Model
{
    protected $table = 'community_subscription';

    protected $fillable = [
        'community_id',
        'user_id',
        'subscription_status',
        'subscription_plan',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'subscription_status' => SubscriptionStatus::class,
        'subscription_plan' => 'free'
    ];

    public function community()
    {
        return $this->belongsTo(CommunitiesModel::class);
    }
}
