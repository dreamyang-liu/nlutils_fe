class ExperimentLogParser {
    keys: string[];
    brief_keys: string[];
    flatten_map: any;
    flatten_maps: any[];
    constructor() {
        this.keys = [];
        this.brief_keys = [];
        this.flatten_map = {};
        this.flatten_maps = [];
    }

    flatten(prefix:string, expLog: { [x: string]: any; }) {
        for(const key in expLog) {
            const value = expLog[key];
            if(typeof value === 'object') {
                this.flatten(prefix + key + '.', value);
            } else {
                if(this.keys.indexOf(prefix + key) === -1) {
                    this.keys.push(prefix + key);
                    this.brief_keys.push(key);
                }
                this.flatten_map[prefix + key] = value;
            }
        }
    }
    
    _parse(log: { [x: string]: any; }) {
        this.keys = [];
        this.brief_keys = [];
        this.flatten_map = {};
        this.flatten('', log);
    }

    parse(log: { [x: string]: any; }): ParameterWarehouse {
        
        this.keys = [];
        this.brief_keys = [];
        this.flatten_maps = [];
        for(const key in log) {
            const value = log[key];
            this._parse(value);
            this.flatten_maps.push(this.flatten_map);
        }
        
        return {
            keys: this.keys,
            brief_keys: this.brief_keys,
            flatten_maps: this.flatten_maps,
        };
    }
}

export interface ParameterWarehouse {
    keys: string[];
    brief_keys: string[];
    flatten_maps: any;
}

export { ExperimentLogParser };

function logUtilsFlattenTest() {
    const logger = new ExperimentLogParser();
    const log = String.raw`{"parameters": {"epoch": 40, "batch_size": 128, "lr": 0.001, "device": "mps"}, "performance": {"accuracy": 0.8741, "f1": 0.8427789198383522}, "profile": {"name": "Test", "id": "574334d83280f6f3e47bcd5ba79c99b9", "commit_id": "fatal: not a git repository (or any of the parent directories): .git", "begin_timestamp": 1662589560.906, "end_timestamp": 1662590554.046, "elapsed_in_s": 993.14, "MD5": "fd7c06652157df21f8569f8e39587e97"}}`;
    logger.parse(JSON.parse(log));
    console.log(logger.flatten_map);
    console.log(logger.keys);
    console.log(logger.brief_keys);
}