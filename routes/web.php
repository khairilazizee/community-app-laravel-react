<?php

use App\Http\Controllers\communitiesController;
use App\Http\Controllers\CommunityBusinessesController;
use App\Http\Controllers\CommunityMembersController;
use App\Http\Controllers\CommunityNewsController;
use App\Http\Controllers\CommunityPostsController;
use App\Http\Controllers\CommunityServicesController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\superadmin\communitiesController as SuperadminCommunitiesController;
use App\Http\Controllers\dashboardController;
use App\Http\Controllers\superadmin\usersController as SuperadminUsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [dashboardController::class, 'index'])->name('dashboard');
    Route::get('communities', [communitiesController::class, 'index'])->name('communities.index');
    Route::get('communities/create', [communitiesController::class, 'create'])->name('communities.create');
    Route::post('communities/create', [communitiesController::class, 'store'])->name('communities.store');
    Route::get('communities/{id}/edit', [communitiesController::class, 'edit'])->name('communities.edit');
    Route::put('communities/{id}/update', [communitiesController::class, 'update'])->name('communities.update');
    Route::delete('communities/{id}/delete', [communitiesController::class, 'delete'])->name('communities.delete');

    Route::get('communities/{id}/members', [CommunityMembersController::class, 'index'])->name('communities.members.index');
    Route::get('communities/{id}/members/create', [CommunityMembersController::class, 'create'])->name('communities.members.create');
    Route::get('communities/{id}/members/{memberId}/edit', [CommunityMembersController::class, 'edit'])->name('communities.members.edit');
    Route::post('communities/{id}/members', [CommunityMembersController::class, 'store'])->name('communities.members.store');
    Route::put('communities/{id}/members/{memberId}', [CommunityMembersController::class, 'update'])->name('communities.members.update');
    Route::delete('communities/{id}/members/{memberId}', [CommunityMembersController::class, 'delete'])->name('communities.members.delete');

    Route::get('communities/{id}/posts', [CommunityPostsController::class, 'index'])->name('communities.posts.index');
    Route::get('communities/{id}/posts/create', [CommunityPostsController::class, 'create'])->name('communities.posts.create');
    Route::get('communities/{id}/posts/{postId}/edit', [CommunityPostsController::class, 'edit'])->name('communities.posts.edit');
    Route::post('communities/{id}/posts', [CommunityPostsController::class, 'store'])->name('communities.posts.store');
    Route::put('communities/{id}/posts/{postId}', [CommunityPostsController::class, 'update'])->name('communities.posts.update');
    Route::delete('communities/{id}/posts/{postId}', [CommunityPostsController::class, 'delete'])->name('communities.posts.delete');

    Route::get('communities/{id}/news', [CommunityNewsController::class, 'index'])->name('communities.news.index');
    Route::get('communities/{id}/news/create', [CommunityNewsController::class, 'create'])->name('communities.news.create');
    Route::get('communities/{id}/news/{newsId}/edit', [CommunityNewsController::class, 'edit'])->name('communities.news.edit');
    Route::post('communities/{id}/news', [CommunityNewsController::class, 'store'])->name('communities.news.store');
    Route::put('communities/{id}/news/{newsId}', [CommunityNewsController::class, 'update'])->name('communities.news.update');
    Route::delete('communities/{id}/news/{newsId}', [CommunityNewsController::class, 'delete'])->name('communities.news.delete');

    Route::get('communities/{id}/services', [CommunityServicesController::class, 'index'])->name('communities.services.index');
    Route::get('communities/{id}/services/create', [CommunityServicesController::class, 'create'])->name('communities.services.create');
    Route::get('communities/{id}/services/{serviceId}/edit', [CommunityServicesController::class, 'edit'])->name('communities.services.edit');
    Route::post('communities/{id}/services', [CommunityServicesController::class, 'store'])->name('communities.services.store');
    Route::put('communities/{id}/services/{serviceId}', [CommunityServicesController::class, 'update'])->name('communities.services.update');
    Route::delete('communities/{id}/services/{serviceId}', [CommunityServicesController::class, 'delete'])->name('communities.services.delete');

    Route::get('communities/{id}/businesses', [CommunityBusinessesController::class, 'index'])->name('communities.businesses.index');
    Route::get('communities/{id}/businesses/create', [CommunityBusinessesController::class, 'create'])->name('communities.businesses.create');
    Route::get('communities/{id}/businesses/{businessId}/edit', [CommunityBusinessesController::class, 'edit'])->name('communities.businesses.edit');
    Route::post('communities/{id}/businesses', [CommunityBusinessesController::class, 'store'])->name('communities.businesses.store');
    Route::put('communities/{id}/businesses/{businessId}', [CommunityBusinessesController::class, 'update'])->name('communities.businesses.update');
    Route::delete('communities/{id}/businesses/{businessId}', [CommunityBusinessesController::class, 'delete'])->name('communities.businesses.delete');

    Route::get('owner', [OwnerDashboardController::class, 'index'])->name('owner.index');

    Route::post('comments', [CommentsController::class, 'store'])->name('comments.store');
    Route::delete('comments/{commentId}', [CommentsController::class, 'delete'])->name('comments.delete');

    Route::get('communities/{slug}/member', [communitiesController::class, 'memberShow'])->name('communities.member');

    Route::middleware(['superadmin'])->group(function () {
        Route::prefix('superadmin')->group(function () {
            Route::get('/users', [SuperadminUsersController::class, 'index'])->name('superadmin.users.index');
            Route::get('/users/{id}/edit', [SuperadminUsersController::class, 'edit'])->name('superadmin.users.edit');
            Route::put('/users/{id}/update', [SuperadminUsersController::class, 'update'])->name('superadmin.users.update');
            Route::get('/communities', [SuperadminCommunitiesController::class, 'index'])->name('superadmin.communities.index');
        });
    });
});

Route::get('communities/{slug}', [communitiesController::class, 'show'])->name('communities.show');
Route::get('communities/{communitySlug}/posts/{slug}', [CommunityPostsController::class, 'show'])->name('communities.posts.show');
Route::get('communities/{communitySlug}/news/{slug}', [CommunityNewsController::class, 'show'])->name('communities.news.show');

require __DIR__ . '/settings.php';
