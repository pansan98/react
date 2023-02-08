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
        Schema::create('my_media', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->string('mime', 100);
            $table->string('ext', 100);
            $table->longText('path')->comment('下層パス');
            $table->longText('name')->nullable()->comment('ファイル名');
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
        Schema::dropIfExists('my_media');
    }
};
