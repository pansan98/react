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
        Schema::table('my_media', function (Blueprint $table) {
            $table->unsignedInteger('media_group_id')->nullable()->after('identify_code');
            $table->foreign('media_group_id')->references('id')->on('my_media_group')->onDelete('set null');
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
        Schema::table('my_media', function (Blueprint $table) {
            $table->dropForeign('my_media_media_group_id_foreign');
            $table->dropColumn('media_group_id');
            //
        });
    }
};
