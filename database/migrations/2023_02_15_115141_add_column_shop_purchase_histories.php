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
		Schema::table('shop_purchase_histories', function (Blueprint $table) {
			$table->bigInteger('price')->default(0)->after('product_id')->comment('購入時点の金額');
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
		Schema::table('shop_purchase_histories', function (Blueprint $table) {
			$table->dropColumn('price');
			//
		});
	}
};
