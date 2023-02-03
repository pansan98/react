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
            $table->string('identify_code', 100)->after('email')->comment('識別コード');
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
            $table->dropColumn('identify_code');
        });
    }
};
