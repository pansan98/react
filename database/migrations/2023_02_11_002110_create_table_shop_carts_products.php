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
        Schema::create('shop_carts_products', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cart_id');
            $table->foreign('cart_id')->references('id')->on('shop_carts')->onDelete('cascade');
            $table->unsignedInteger('product_id');
            $table->foreign('product_id')->references('id')->on('shop_products')->onDelete('cascade');
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
        Schema::dropIfExists('shop_carts_products');
    }
};
