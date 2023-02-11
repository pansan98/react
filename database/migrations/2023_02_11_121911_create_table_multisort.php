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
        Schema::create('multisort', function (Blueprint $table) {
            $table->id();
            $table->string('base', 100);
            $table->string('key1', 100)->nullable();
            $table->string('key2', 100)->nullable();
            $table->string('key3', 100)->nullable();
            $table->string('key4', 100)->nullable();
            $table->string('key5', 100)->nullable();
            $table->bigInteger('order_no');
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
        Schema::dropIfExists('multisort');
    }
};
