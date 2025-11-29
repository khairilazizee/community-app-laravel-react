<?php

namespace App;

enum CommunityMemberRole: string
{
    case Admin = "admin";
    case Owner = "owner";
    case Member = "member";
}
