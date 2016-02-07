class AnnotationSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :article_id, :destination_language, :source_text, :location_start, :location_end, :word_count, :character_count, :annotation_category_id, :definition, :reading, :translation, :usage_note, :specific_note, :paragraph_id
end
