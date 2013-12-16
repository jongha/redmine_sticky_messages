class StickyMessagesHeaderHooks < Redmine::Hook::ViewListener
  include ApplicationHelper
  include BannerHelper

  def view_layouts_base_html_head(context = {})
    o = stylesheet_link_tag('sticky_messages', :plugin => 'redmine_sticky_messages')
    o << javascript_include_tag('sticky_messages', :plugin => 'redmine_sticky_messages')
    return o
  end
end