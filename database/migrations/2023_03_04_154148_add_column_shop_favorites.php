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
		Schema::table('shop_favorites', function (Blueprint $table) {
			$table->unsignedInteger('folder_id')->nullable()->after('product_id');
			$table->foreign('folder_id')->references('id')->on('folders')->onDelete('SET NULL');
			//
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('shop_favorites', function (Blueprint $table) {
			$table->dropForeign('shop_favorites_folder_id_foreign');
			$table->dropColumn('folder_id');
			//
		});
	}
};
