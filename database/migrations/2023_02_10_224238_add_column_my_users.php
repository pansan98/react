<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('my_users', function (Blueprint $table) {
            $table->unsignedInteger('active_sharing_id')->nullable()->after('thumbnail_id');
            $table->foreign('active_sharing_id')->references('id')->on('sharing_login')->onDelete('set null');
            //
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('my_users', function (Blueprint $table) {
            $table->dropForeign('my_users_active_sharing_id_foreign');
            $table->dropColumn('active_sharing_id');
            //
        });
    }
};
