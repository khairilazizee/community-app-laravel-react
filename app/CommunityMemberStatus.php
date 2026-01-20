<?php

namespace App;

enum CommunityMemberStatus: string
{
    case Pending = "pending";
    case Active = "active";
    case InActive = "inactive";
}
