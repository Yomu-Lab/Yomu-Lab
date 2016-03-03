json.array!(@language_levels) do |language_level|
  json.extract! language_level, :id, :language_id, :level
  json.url language_level_url(language_level, format: :json)
end
