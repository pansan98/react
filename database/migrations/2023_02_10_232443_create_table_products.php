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
        Schema::create('shop_products', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('my_users')->onDelete('cascade')->comment('商品出品者');
            $table->string('name', 191);
            $table->longText('description')->nullable();
            $table->longText('benefits')->nullable()->comment('特典用');
            $table->timestamp('benefits_start')->nullable();
            $table->timestamp('benefits_end')->nullable();
            $table->integer('inventoly')->default(0)->comment('在庫数');
            $table->integer('max_purchase')->default(1)->comment('1度に購入できる最大数');
            $table->integer('fasted_delivery_day')->default(3)->comment('購入日から最低で配達可能日数(購入日から3日後みたいな)');
            $table->json('customs')->nullable()->comment('不規則情報用');
            $table->softDeletes();
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
        Schema::dropIfExists('products');
    }
};
