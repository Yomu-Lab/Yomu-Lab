class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :original_language, :level, :title, :body, :source_name, :source_url, :publication_status, :word_count, :character_count
end
