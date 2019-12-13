/**
 * Trace is a Scripter specific function, rather than a JavaScript function.
 * You can also use Scripter’s Event.trace function to log events to the plug-in console.
 * For more information, see Use the JavaScript Event object.
 * @param value
 */
 declare function Trace(value : any) : void;

/**
 * The HandleMIDI() function lets you process MIDI events that the plug-in receives.
 * HandleMIDI is called each time a MIDI event is received by the plug-in and is required in order to process incoming MIDI events.
 * If you don’t implement the HandleMIDI function, events pass through the plug-in unaffected.
 * HandleMIDI is called with one argument, which is a JavaScript object that represents the incoming MIDI event.
 * HandleMIDI and JavaScript Event object use is shown in the examples.
 * @param event 
 */

declare function HandleMIDI(event : Logic.Event) : void;

/**
 * The ProcessMIDI() function lets you perform periodic (generally timing-related) tasks.
 * The function can be used when scripting a sequencer, an arpeggiator, or another tempo-driven MIDI effect.
 * ProcessMIDI is generally not required for applications that don’t make use of musical timing information from the host.
 * ProcessMIDI is called once per “process block,” which is determined by the host audio settings (sample rate and buffer size).
 * This function is often used in combination with the TimingInfo object to make use of timing information from Logic Pro X.
 * The use of ProcessMIDI and the TimingInfo object is shown in the example.
 * Also see Use the JavaScript TimingInfo object.
 */
declare function ProcessMIDI() : void;

/**
 * Every MIDI event in Scripter has a property called “beatPos” that carries the exact beat position of the event.
 * This makes more exact event timing possible and also handles loops correctly.
 * This property can be used in place of timingInfo.blockStartBeat.
 * This property only works if "var NeedsTimingInfo = true",
 * otherwise it will have a value of 0, and will print a warning if modified.
 */
declare var NeedsTimingInfo : boolean;

declare function GetTimingInfo() : Logic.TimingInfo;

declare var PluginParameters : Logic.PluginParameterInfo[];

/**
 * The GetParameter() function retrieves information from parameters defined with var PluginParameters.
 * @param name The name argument must match the defined PluginParameters name value.
 */
declare function GetParameter(name : string) : number;
/**
 * The SetParameter() function allows you to programmatically set the value of a control.
 * Important: Using SetParameter and track automation for a parameter at the same time can lead to unexpected behavior.
 * You can circumvent such problems by disabling automation for each parameter.
 * @param target target describes which parameter is accessed. This can be either an integer (index) or a string (parameter name).
 * @param value value is the value that you want to set (this is always a number).
 */
declare function SetParameter(target : string | number, value : number) : void;
/**
 * The ParameterChanged() function lets you perform tasks triggered by changes to plug-in parameters.
 * ParameterChanged is called each time one of the plug-in parameters is set to a new value.
 * ParameterChanged is also called once for each parameter when you load a plug-in setting.
 * @param param the parameter index (an integer number starting from 0),
 * @param value the parameter value (a number).
 */
declare function ParameterChanged(param : number, value : number) : void;

/**
 * Reset() is called when you bypass the Scripter plug-in and when the transport is started.
 * You can implement this function to clear the plug-in history and set Scripter to its default state.
 */
declare function Reset() : void;

/**
 * The MIDI object contains a number of convenient and easy to use functions that can be used when writing your scripts.
 * Note: The MIDI object is a property of the global object,
 *       which means that you do not instantiate it but access its functions much like
 *       you would the JavaScript Math object.An example is calling MIDI.allNotesOff() directly.
 */
declare namespace MIDI {
    /**
     * Returns the MIDI note number for a given note name. For example: C3 or B#2.
     * Note: You cannot use flats in your argument. Use A#3, not Bb3.
     * @param name MIDI note name
     */
    function noteNumber(name : string) : number;
    /**
     * Returns the name (string) for a given MIDI note number.
     * @param pitch MIDI note number
     */
    function noteName(pitch : number) : string;
    /**
     * Returns the controller name (string) for a given controller number.
     * @param controller controller number
     */
    function ccName(controller : number) : string;
    /**
     * Sends the all notes off message on all MIDI channels.
     */
    function allNotesOff() : void;
    /**
     * Normalizes a value to the safe range of MIDI status bytes (128–239).
     * @param status 
     */
    function normalizeStatus(status : number) : number;
    /**
     * Normalizes a value to the safe range of MIDI channels (1–16).
     */
    function normalizeChannel(channel : number) : number;
    /**
     * Normalizes a value to the safe range of MIDI data bytes (0–127).
     */
    function normalizeData(data : number) : number;
}

declare class NoteOn extends Logic.Event {
    /**
     * Pitch from 1–127.(integer)
     */
    pitch : number;
    /**
     * Velocity from 0–127.(integer)
     * A velocity value of 0 is interpreted as a note off event, not a note on.
     */
    velocity : number;
}

declare class NoteOff extends Logic.Event {
    constructor(on : NoteOn);
    /**
     * Pitch from 1–127.
     */
    pitch : number;
    /**
     * Velocity from 0–127.
     */
    velocity : number;
}

declare class PolyPressure extends Logic.Event {
    /**
     * Pitch from 1–127.
     */
    pitch : number;
    /**
     * Define a pressure value from 0–127.
     */
    value : number;
}

declare class ControlChange extends Logic.Event {
    /**
     * Controller number from 0–127.
     */
    number : number;
    /**
     * Controller value from 0–127.
     */
    value : number;
}

declare class ProgramChange extends Logic.Event {
    /**
     * Program change number from 0–127.
     */
    number : number;
}

declare class ChannelPressure extends Logic.Event {
    /**
     * Aftertouch value from 0–127.
     */
    value : number;
}

declare class PitchBend extends Logic.Event {
    /**
     * 14-bit pitch bend value from -8192–8191. A value of 0 is center.
     */
    value : number;
}

declare class TargetEvent extends Logic.Event {
    /**
     * Create user definable MIDI CC messages or control plug-in parameters.
     */
    target : string;
    /**
     * Sets the target value.
     */
    value : number;
}

declare namespace Logic {

    interface TimingInfo {
        /**
         * Uses Boolean logic where “true” means the host transport is running.
         */
        playing : boolean,
        /**
         * A floating point number indicates the beat position at the start of the process block. 
         * An alternative is to use the beatPos property. See Use the MIDI event beatPos property.
         */
        blockStartBeat : number,
        /**
         * A floating point number indicates the beat position at the end of the process block.
         */
        blockEndBeat : number,
        /**
         * A floating point number indicates the length of the process block in beats.
         */
        blockLength: number,
        /**
         * A floating point number indicates the host tempo.
         */
        tempo : number,
        /**
         * An integer number indicates the host meter numerator.
         */
        meterNumerator : number,
        /**
         * An integer number indicates the host meter denominator.
         */
        meterDenominator: number,
        /**
         *  Uses Boolean logic where “true” means the host transport is cycling.
         */
        cycling: boolean,
        /**
         * A floating point number indicates the beat position at the start of the cycle range.
         */
        leftCycleBeat: number,
        /**
         * A floating point number indicates the beat position at the end of the cycle range.
         */
        rightCycleBeat: number
    }

    interface PluginParameterInfo {
        /**
         * The name of a parameter.
         */
        name : string,
        /**
         * Type one of the following strings as the value:
         * “lin”: Creates a linear fader.
         * “log”: Creates a logarithmic fader.
         * “momentary”: Creates a momentary button.
         * “menu”: Creates a menu.
         * The menu type requires an additional valueStrings property that is an array of strings to show in the menu. 
         */
        type : string,
        /**
         * Type an integer or floating point number to set a default value.
         * If no value is typed, the default is 0.0.
         * If type is "menu", this value is ignored (default is used).
         */
        defaultValue : number,
        /**
         * Type an integer or floating point number to set a minimum value.
         * If no value is typed, the default is 0.0.
         * If type is "menu", this value is ignored (default is used).
         */
        minValue : number,
        /**
         * Type an integer or floating point number to set a maximum value.
         * If no value is typed, the default is 1.0.
         * If type is "menu", this value is ignored. maxValue = len(valueStrings)
         */
        maxValue : number,
        /**
         * Type an integer number to define the number of steps.
         * If type is "menu", this value is ignored. numberOfSteps = len(valueStrings)
         */
        numberOfSteps : number,
        /**
         * Type a string to present a unit description in the plug-in controls.
         * If no value is typed, the default behavior is to display no unit.
         */
        unit : string,
        /**
         * Type text to create a divider/header in the plug-in UI.
         */
        text : string,
        /**
         * this values is used when type is "menu".
         */
        valueStrings : string[],
        /**
         * If true, this parameter is hidden in the UI.
         */
        hidden : boolean
    }
    /**
     * When the HandleMIDI function is called,
     * an Event object represents one MIDI event and implements several methods
     * you can call in your script.
     * The Event object is not instantiated directly,
     * but is a prototype for the following event-specific methods, properties, and types.
     */
    abstract class Event {
        /**
         * Send the event.
         */
        send() : void;
        /**
         * Send the event after the specified value has elapsed.
         * @param ms milliseconds (integer of float)
         */
        sendAfterMilliseconds(ms : number) : void;
        /**
         * Send the event at a specific beat (floating point number) in the host timeline.
         * @param beat 
         */
        sendAtBeat(beat : number) : void;
        /**
         * As above(sendAtBeat), but uses the beat value as a delay in beats from the current position.
         * @param beat 
         */
        sendAfterBeats(beat : number) : void;
        /**
         * Print the event to the plug-in console.
         */
        trace() : void;
        /**
         * Returns a String representation of the event.
         */
        toString() : string;
        /**
         * Sets the articulation ID from 0–254.
         */
        toarticulationID : number;
        /**
         * Set MIDI channel 1 to 16.
         */
        channel : number;
        /**
         * Retrieves the event’s exact beat position.
         */
        beatPos : number;
    }
}

export default Logic;