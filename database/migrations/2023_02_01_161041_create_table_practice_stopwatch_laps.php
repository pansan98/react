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
		Schema::create('practice_stopwatch_laps', function (Blueprint $table) {
			$table->increments('id');
			$table->unsignedInteger('parent_id');
			$table->foreign('parent_id')->references('id')->on('practice_stopwatch_lap')->onDelete('cascade');
			$table->integer('lap_number');
			$table->string('lap_time')->nullable();
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
		Schema::dropIfExists('practice_stopwatch_laps');
	}
};
