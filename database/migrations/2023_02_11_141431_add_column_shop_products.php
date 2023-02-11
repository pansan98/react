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
            $table->string('identify_code', 100)->after('media_group_id');
            $table->bigInteger('inventoly_danger')->default(0)->after('inventoly')->commnet('在庫数が残りN個になったら警告する');
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
            $table->dropColumn('indentify_code');
            $table->dropColumn('inventoly_danger');
            //
        });
    }
};
