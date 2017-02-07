module.exports = {
	"id": "Frenchbeans",
	"properties": {
		"id": {
			"type": "number",
			"description": "The id of a particular vegetable"
		},
		"Canopy": {
			"type": "string",
			"description": "canopy of the data"
		},
		"providers": {
			"type":"array",
			"description":"List of people who provided the dataset",
			"items": {
				"$ref": "Provider"
			}
		},
		"ipm": {
			"description": "The data ipm",
			"type":"string"
		},
		"no_rust": {
			"type": "string",
			"description": "Something about no rust"
		},
		"no_thrips": {
			"type": "string",
			"description": "Something about no no_thrips"
		},
		"all_control": {
			"type": "string",
			"description": "Something about all_control"

		},
		"no_control": {
			"type": "string",
			"description": "Something about no_control"
		}
	}
}