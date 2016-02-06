json.array!(@annotation_categories) do |annotation_category|
  json.extract! annotation_category, :id, :name, :status
  json.url annotation_category_url(annotation_category, format: :json)
end
