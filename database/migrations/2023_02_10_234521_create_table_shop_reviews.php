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
        Schema::create('shop_reviews', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('product_id');
            $table->foreign('product_id')->references('id')->on('shop_products')->onDelete('cascade');
            $table->unsignedInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('my_users')->onDelete('set null');
            $table->integer('star')->default(0)->comment('評価');
            $table->longText('comment');
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
        Schema::dropIfExists('shop_reviews');
    }
};
