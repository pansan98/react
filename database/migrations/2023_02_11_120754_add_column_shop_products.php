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
        Schema::table('shop_products', function (Blueprint $table) {
            $table->integer('status')->default(1)->after('description')->comment('商品の状態');
            $table->unsignedInteger('media_group_id')->nullable()->after('user_id');
            $table->foreign('media_group_id')->references('id')->on('my_media_group')->onDelete('cascade');
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
        Schema::table('shop_products', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropForeign('shop_products_media_group_id_foreign');
            $table->dropColumn('media_group_id');
            //
        });
    }
};
