<?php

namespace App;

enum SubscriptionStatus: string
{
    case Active = "active";
    case Trial = "trial";
    case Expired = "expired";
    case Canceled = "canceled";
}
