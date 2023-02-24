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
        Schema::create('my_users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('login_id', 191)->nullable();
            $table->longText('password')->nullable();
            $table->string('name', 191);
            $table->string('email', 191)->nullable();
            $table->tinyInteger('active_flag')->unsigned()->default(0);
            $table->tinyInteger('delete_flag')->unsigned()->default(0);
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
        Schema::dropIfExists('my_users');
    }
};
