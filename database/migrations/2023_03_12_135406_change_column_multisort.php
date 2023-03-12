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
        Schema::table('multisort', function (Blueprint $table) {
            $table->dropColumn('base');
            $table->morphs('applyable');
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
        Schema::table('multisort', function (Blueprint $table) {
            $table->string('base', 100);
            $table->dropMorphs('applyable');
            //
        });
    }
};
