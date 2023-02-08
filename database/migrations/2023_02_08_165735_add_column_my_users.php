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
			$table->unsignedInteger('thumbnail_id')->nullable()->after('identify_code');
			$table->foreign('thumbnail_id')->references('id')->on('my_media')->onDelete('set null');
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
			$table->dropForeign('my_users_thumbnail_id_foreign');
			$table->dropColumn('thumbnail_id');
		});
	}
};
