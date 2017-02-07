module.exports = {
	"id": "Iron_in_aiv",
	"properties": {
		"id": {
			"type": "number",
			"description": "The id of a particular vegetable"
		},
		"aiv": {
			"type": "string",
			"description": "The name of the vegetable."
		},
		"providers": {
			"type":"array",
			"description":"List of people who provided the dataset",
			"items": {
				"$ref": "Provider"
			}
		},
		"raw": {
			"description": "Iron nutritional value in the raw vegetable.",
			"type":"string"
		},
		"boiled_with_iye": {
			"type": "string",
			"description": "Iron content when the vegetable is fried with iye"
		},
		"boiled_no_iye": {
			"type": "string",
			"description": "Iron content when the vegetable is just boiled without iye"
		},
		"fried_with_iye": {
			"type": "string",
			"description": "Iron content when the vegetable is fried with iye"

		},
		"fried_no_iye": {
			"type": "string",
			"description": "Iron content when the vegetable is fried without iye"
		}
	}
}