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
        Schema::table('shop_purchase_histories', function (Blueprint $table) {
            $table->dropForeign('shop_purchase_histories_user_id_foreign');
            $table->dropColumn('user_id');
            $table->unsignedInteger('purchase_id')->nullable()->after('id');
            $table->foreign('purchase_id')->references('id')->on('shop_purchase')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shop_purchase_histories', function (Blueprint $table) {
            $table->dropForeign('shop_purchase_histories_purchase_id_foreign');
            $table->dropColumn('purchase_id');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('my_users')->onDelete('cascade');
        });
    }
};
