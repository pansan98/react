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
        Schema::create('shop_discounts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 191);
            $table->bigInteger('discount')->default(0);
            $table->string('type', 100)->default('user')->comment('個人発行か管理者発行か');
            $table->string('coupon_code', 100)->default(null)->nullable()->comment('クーポンコード(入力されていれば適用する)');
            $table->timestamp('discount_start')->default(null)->nullable()->comment('適用開始日時');
            $table->timestamp('discount_end')->default(null)->nullable()->comment('適用終了日時');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shop_discounts');
    }
};
