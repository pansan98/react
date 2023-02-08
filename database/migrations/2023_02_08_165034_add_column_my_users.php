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
		Schema::table('my_users', function (Blueprint $table) {
			$table->string('profession', 191)->nullable()->after('email');
			$table->integer('gender')->nullable()->after('profession');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('my_users', function (Blueprint $table) {
			$table->dropColumn('profession');
			$table->dropColumn('gender');
		});
	}
};
