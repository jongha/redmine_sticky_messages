require 'redmine'

Redmine::Plugin.register :redmine_sticky_messages do
  name 'Redmine Sticky Messages plugin'
  author 'Jong-Ha Ahn'
  description 'This is a plugin for Redmine'
  version '1.0.2'
  url 'http://github.com/jongha/redmine_sticky_messages'
  author_url 'http://www.mrlatte.net'

  require File.expand_path('lib/sticky_messages_application/hooks', __dir__)

  if Rails.configuration.respond_to?(:autoloader) && Rails.configuration.autoloader == :zeitwerk
    Rails.autoloaders.each { |loader| loader.ignore(File.expand_path('lib/sticky_messages_application', __dir__)) }
  end
end