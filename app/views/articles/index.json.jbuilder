json.array!(@articles) do |article|
  json.extract! article, :id, :user_id, :original_language, :level, :title, :body, :source_name, :source_url, :publication_status, :word_count, :character_count, :created_at, :updated_at

  article_creator = User.find_by_id(article.user_id)
  json.creator "#{article_creator.first_name} #{article_creator.last_name}"

  json.url article_url(article, format: :json)

end
