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
		Schema::table('folders', function (Blueprint $table) {
			$table->string('apply', 100)->after('folderable_id');
			$table->dropForeign('folders_user_id_foreign');
			$table->dropColumn('user_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('folders', function (Blueprint $table) {
			$table->dropColumn('apply');
			$table->unsignedInteger('user_id');
			$table->foreign('user_id')->references('id')->on('my_users')->onDelete('cascade');
		});
	}
};
