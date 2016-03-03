json.array!(@languages) do |language|
  json.extract! language, :id, :name, :code, :status
  json.url language_url(language, format: :json)
end
