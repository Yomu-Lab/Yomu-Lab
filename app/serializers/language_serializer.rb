class LanguageSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :status
end
