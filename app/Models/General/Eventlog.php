<?php

namespace App\Models\General;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
 * App\Models\General\Eventlog
 *
 * @property integer $event_id
 * @property integer $host
 * @property string $datetime
 * @property string $message
 * @property string $type
 * @property string $reference
 * @property-read \App\Models\Device $device
 * @method static \Illuminate\Database\Query\Builder|\App\Models\General\Eventlog whereEventId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\General\Eventlog whereHost($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\General\Eventlog whereDatetime($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\General\Eventlog whereMessage($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\General\Eventlog whereType($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\General\Eventlog whereReference($value)
 * @mixin \Eloquent
 */
class Eventlog extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'eventlog';
    /**
     * The primary key column name.
     *
     * @var string
     */
    protected $primaryKey = 'event_id';


    // ---- Accessors/Mutators ----


    // ---- Define Reletionships ----

    /**
     * Returns the device this entry belongs to.
     */
    public function device()
    {
        return $this->belongsTo('App\Models\Device', 'host');
    }
}
